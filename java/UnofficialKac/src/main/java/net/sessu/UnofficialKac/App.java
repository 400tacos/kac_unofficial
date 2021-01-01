package net.sessu.UnofficialKac;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Hello world!
 *
 */
public class App {
	public static void main(String[] args) {

		List<Player> players = new ArrayList<Player>();
		try {
			
			Document doc = Jsoup
					.connect("https://docs.google.com/spreadsheets/d/1zJb2nIX6bV5Sm2FGw_OPWfwMZYiyNzJpvdgfUgdrod8/")
					.ignoreContentType(true).userAgent("Mozilla/5.0").get();
			
			players.addAll(get_players(doc, 1));
			
			doc = Jsoup
					.connect("https://docs.google.com/spreadsheets/d/17cQ8RzZNHsav4OuTHs6w8y4wcj5RXqYwWv2_B2rXoX0/")
					.ignoreContentType(true).userAgent("Mozilla/5.0").get();
			
			//show_rows(doc);
			
			players.addAll(get_players(doc, 2));
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		Collections.sort(players, Collections.reverseOrder());
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		try {
			//File dir = new File("D:\\CODING\\kac_unofficial\\js");
			File dir = new File("/srv/www/sessu.net/kac_unofficial/js");
			dir.mkdirs();
			File file = new File(dir, "kacstandings.js");
			FileWriter writer = new FileWriter(file);
			writer.write("let KAC_STANDINGS = " + gson.toJson(players) + ";");
			writer.write("let lastUpdateUnixSec=" + Instant.now().getEpochSecond() + ";");
			writer.flush();
			writer.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println();

	}
	
	public static void show_rows(Document doc) {
		Elements rows = doc.select("tr");
		for (int i = 0; i < rows.size(); i++) {
			if (rows.get(i).text().length() > 1) {
				System.out.println(rows.get(i).text());
			}
		}
		
	}

	public static List<Player> get_players(Document doc, int region) {
		List<Player> players = new ArrayList<Player>();
		Elements rows = doc.select("tr");

		for (int i = 3; i < 53; i++) {
			if (rows.get(i).selectFirst("td").text().length() > 1) {
				Elements score_td = rows.get(i).select("td");
				int j = 0;
				for (Element cell : score_td) {
					System.out.print(j + ":" + cell.text() + " ");
					j++;
				}

				Player new_player = new Player(score_td.get(0).text());
				new_player.setRegion(region);
				new_player.setScore0(value_or_zero(score_td.get(2).text()));
				new_player.setScore1(value_or_zero(score_td.get(3).text()));
				new_player.setScore2(value_or_zero(score_td.get(4).text()));
				new_player.setScore3(value_or_zero(score_td.get(5).text()));
				new_player.setScore4(value_or_zero(score_td.get(6).text()));
				new_player.setScore5(value_or_zero(score_td.get(7).text()));
				new_player.setScore6(value_or_zero(score_td.get(8).text()));
				new_player.setScore7(value_or_zero(score_td.get(9).text()));
				new_player.setScore8(value_or_zero(score_td.get(10).text()));
				new_player.setScore9(value_or_zero(score_td.get(11).text()));
				new_player.setScore10(value_or_zero(score_td.get(12).text()));
				new_player.setScore11(value_or_zero(score_td.get(13).text()));
				new_player.setScore12(value_or_zero(score_td.get(14).text()));
				new_player.setScore13(value_or_zero(score_td.get(15).text()));
				new_player.setScore14(value_or_zero(score_td.get(16).text()));

				System.out.println(new_player.toString());
				players.add(new_player);
			}
		}

		return players;

	}

	public static int value_or_zero(String input) {
		try {
			return Integer.valueOf(input);
		} catch (NumberFormatException e) {
			return 0;
		}
	}
}
