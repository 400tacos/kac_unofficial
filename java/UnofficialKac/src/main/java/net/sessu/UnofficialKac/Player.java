package net.sessu.UnofficialKac;

public class Player implements Comparable<Player> {
	private String name;
	private int region;
	private int ddrcode;
	private int score0,score1,score2,score3,score4,score5,score6,score7,score8,score9,score10,score11,score12,score13,score14;
	
	public Player(String name) {
		super();
		this.name = name;
	}

	@Override
	public String toString() {
		return "Player [" + (name != null ? "name=" + name + ", " : "") + "region=" + region + ", ddrcode=" + ddrcode
				+ ", score0=" + score0 + ", score1=" + score1 + ", score2=" + score2 + ", score3=" + score3
				+ ", score4=" + score4 + ", score5=" + score5 + ", score6=" + score6 + ", score7=" + score7
				+ ", score8=" + score8 + ", score9=" + score9 + ", score10=" + score10 + ", score11=" + score11
				+ ", score12=" + score12 + ", score13=" + score13 + ", score14=" + score14 + "]";
	}
	
	@Override
    public int compareTo(Player o) {
        return Integer.compare(this.getTotal(), o.getTotal());
       }
	
	public int getTotal() {
		return score0+score1+score2+score3+score4+score5+score6+score7+score8+score9+score10+score11+score12+score13+score14;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getRegion() {
		return region;
	}

	public void setRegion(int region) {
		this.region = region;
	}

	public int getDdrcode() {
		return ddrcode;
	}

	public void setDdrcode(int ddrcode) {
		this.ddrcode = ddrcode;
	}

	public int getScore0() {
		return score0;
	}

	public void setScore0(int score0) {
		this.score0 = score0;
	}

	public int getScore1() {
		return score1;
	}

	public void setScore1(int score1) {
		this.score1 = score1;
	}

	public int getScore2() {
		return score2;
	}

	public void setScore2(int score2) {
		this.score2 = score2;
	}

	public int getScore3() {
		return score3;
	}

	public void setScore3(int score3) {
		this.score3 = score3;
	}


	public int getScore4() {
		return score4;
	}

	public void setScore4(int score4) {
		this.score4 = score4;
	}

	public int getScore5() {
		return score5;
	}

	public void setScore5(int score5) {
		this.score5 = score5;
	}

	public int getScore6() {
		return score6;
	}

	public void setScore6(int score6) {
		this.score6 = score6;
	}

	public int getScore7() {
		return score7;
	}

	public void setScore7(int score7) {
		this.score7 = score7;
	}

	public int getScore8() {
		return score8;
	}

	public void setScore8(int score8) {
		this.score8 = score8;
	}

	public int getScore9() {
		return score9;
	}

	public void setScore9(int score9) {
		this.score9 = score9;
	}

	public int getScore10() {
		return score10;
	}

	public void setScore10(int score10) {
		this.score10 = score10;
	}

	public int getScore11() {
		return score11;
	}

	public void setScore11(int score11) {
		this.score11 = score11;
	}

	public int getScore12() {
		return score12;
	}

	public void setScore12(int score12) {
		this.score12 = score12;
	}

	public int getScore13() {
		return score13;
	}

	public void setScore13(int score13) {
		this.score13 = score13;
	}

	public int getScore14() {
		return score14;
	}

	public void setScore14(int score14) {
		this.score14 = score14;
	}

}
